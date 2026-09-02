#!/usr/bin/env python3
"""Validate Last Asylum Toolkit JSON datasets and their cross-file references."""

import json
from pathlib import Path

try:
    import jsonschema
except ImportError as error:
    raise SystemExit("Missing optional validator dependency: install Python package 'jsonschema'.") from error


ROOT = Path(__file__).resolve().parents[1]
DATA_DIRECTORY = ROOT / "public" / "data"


def read_json(path):
    """Read a UTF-8 JSON document from the repository."""
    return json.loads(path.read_text(encoding="utf-8"))


def validate_research_tree(path, schema):
    """Validate one research tree and its node-to-research references."""
    tree = read_json(path)
    instance = dict(tree)
    instance.pop("$schema", None)
    jsonschema.validate(instance, schema)

    listed_researches = [
        research_id
        for node in tree["nodes"]
        for research_id in node["researchIds"]
    ]
    if len(listed_researches) != len(set(listed_researches)):
        raise ValueError(f"{path}: a research is referenced by multiple nodes")
    if set(listed_researches) != set(tree["researches"]):
        raise ValueError(f"{path}: node references and research records differ")

    for research_id, research in tree["researches"].items():
        expected_levels = list(range(1, research["maxLevel"] + 1))
        actual_levels = [level["level"] for level in research["levels"]]
        if actual_levels != expected_levels:
            raise ValueError(f"{path}: {research_id} levels are not continuous")


def validate_hero_coverage():
    """Ensure every catalogued hero has exactly one profile and skill dataset."""
    catalog = read_json(DATA_DIRECTORY / "heroes" / "catalog.json")["data"]
    profiles = read_json(DATA_DIRECTORY / "heroes" / "profiles.json")["data"]
    catalog_ids = {hero["id"] for hero in catalog}
    skill_ids = {path.stem for path in (DATA_DIRECTORY / "heroes" / "skills").glob("*.json")}

    if catalog_ids != set(profiles):
        raise ValueError("Hero catalogue and profile identifiers differ")
    if catalog_ids != skill_ids:
        raise ValueError("Hero catalogue and skill identifiers differ")
    return len(catalog_ids)


def main():
    """Run schema and relationship validation for every game dataset."""
    generic_schema = read_json(DATA_DIRECTORY / "game-dataset.schema.json")
    research_schema = read_json(DATA_DIRECTORY / "research" / "research-tree.schema.json")
    regular_count = 0
    research_count = 0

    for path in DATA_DIRECTORY.rglob("*.json"):
        if path.name.endswith(".schema.json"):
            continue
        if path.parent.name == "research":
            validate_research_tree(path, research_schema)
            research_count += 1
        else:
            jsonschema.validate(read_json(path), generic_schema)
            regular_count += 1

    hero_count = validate_hero_coverage()
    print(
        f"Validated {regular_count} regular datasets, "
        f"{research_count} research trees and {hero_count} heroes."
    )


if __name__ == "__main__":
    main()

<script>
  import { loadJsonDocument } from '../lib/core/datasets.js';
  import {
    RESEARCH_TREES,
    RESEARCH_NODE_ICONS,
    getTreeProgress,
    getTreeResearches,
    getOrderedNodes,
    getResearchState,
    getResearchLevel,
    setResearchLevel,
    getUnmetResearchPrerequisites
  } from '../lib/core/researches.js';
  import { t } from '../lib/state/preferences.ts';
  import Icon from '../lib/components/Icon.svelte';
  import ResearchModal from '../lib/components/ResearchModal.svelte';
  const data = Promise.all(RESEARCH_TREES.map((item) => loadJsonDocument(item.path)));
  let selectedId = $state('development'),
    selectedResearchId = $state(null),
    revision = $state(0);
  function title(tree) {
    return $t(RESEARCH_TREES.find((item) => item.id === tree.id)?.title || tree.nameKey);
  }
  function adjust(tree, change) {
    const research = { id: selectedResearchId, ...tree.researches[selectedResearchId] };
    if (change > 0 && getUnmetResearchPrerequisites(tree, research).length) return;
    setResearchLevel(
      tree.id,
      research.id,
      Math.min(research.maxLevel, Math.max(0, getResearchLevel(tree.id, research) + change))
    );
    revision++;
  }
</script>

{#await data}<section class="panel"><p class="form-note">{$t('research_loading')}</p></section>{:then trees}
  {@const tree = trees.find((tree) => tree.id === selectedId)}
  {#key revision}
    <section class="research-overview research-experience">
      <p class="sources-intro">{$t('researches_intro')}</p>
      <div class="research-grid">
        {#each trees as candidate}{@const progress = getTreeProgress(candidate)}<button
            class="research-card research-tree-selector"
            class:selected={candidate.id === selectedId}
            onclick={() => {
              selectedId = candidate.id;
              selectedResearchId = null;
            }}
            ><span class="research-card-icon"
              ><Icon name={RESEARCH_TREES.find((item) => item.id === candidate.id).icon} /></span
            ><strong>{progress.percent}%</strong><span>{title(candidate)}</span><small
              >{getTreeResearches(candidate).length} {$t('researches_count')}</small
            ></button
          >{/each}
      </div>
    </section>
    {@const progress = getTreeProgress(tree)}{@const nodes = getOrderedNodes(tree)}
    <section class="panel research-tree-panel research-experience">
      <div class="research-tree-head">
        <div>
          <span class="kicker">{$t('research_progress')}</span>
          <h3>{title(tree)}</h3>
        </div>
        <strong>{progress.percent}%</strong>
      </div>
      <div class="research-progress"><span style={'width:' + progress.percent + '%'}></span></div>
      <div class="research-tree-viewport">
        <div class="research-tree-canvas">
          <div class="research-game-tree">
            {#each nodes as node, index}<div
                class={'research-tree-tier ' +
                  (nodes[index - 1] ? 'receives-' + nodes[index - 1].researchIds.length : '') +
                  ' ' +
                  (nodes[index + 1] ? 'feeds-' + nodes[index + 1].researchIds.length : '')}
              >
                {#each node.researchIds as id}{@const research = {
                    id,
                    ...tree.researches[id]
                  }}{@const state = getResearchState(tree, research)}{@const level = getResearchLevel(
                    tree.id,
                    research
                  )}
                  <div class="research-tree-node-slot">
                    <button
                      class={'research-node game-tree-node ' + state}
                      class:selected={id === selectedResearchId}
                      onclick={() => (selectedResearchId = id)}
                      title={research.sourceNameFr + ' — ' + $t('research_click_to_select')}
                      aria-label={research.sourceNameFr +
                        ', ' +
                        level +
                        '/' +
                        research.maxLevel +
                        '. ' +
                        $t('research_click_to_select')}
                      ><span class="research-node-icon"
                        ><Icon
                          name={state === 'locked'
                            ? 'lock-keyhole'
                            : state === 'complete'
                              ? 'badge-check'
                              : RESEARCH_NODE_ICONS[research.category] || 'flask-conical'}
                        /></span
                      ><span class="research-node-content"
                        ><strong>{research.sourceNameFr}</strong><small
                          >{research.sourceDescriptionFr || ''}</small
                        ></span
                      ><span class="research-node-level">{level}/{research.maxLevel}</span></button
                    >
                  </div>{/each}
              </div>
              {#if nodes[index + 1]}<div
                  class={'research-tree-connector from-' +
                    node.researchIds.length +
                    ' to-' +
                    nodes[index + 1].researchIds.length}
                  aria-hidden="true"
                >
                  <span class="research-connector-parent-rail"></span><span class="research-connector-trunk"
                  ></span><span class="research-connector-child-rail"></span>
                </div>{/if}{/each}
          </div>
        </div>
      </div>
      <p class="research-click-hint"><Icon name="mouse-pointer-click" /> {$t('research_click_to_select')}</p>
      <p class="form-note">{$t('research_tree_verified')}</p>
    </section>
  {/key}
  {#if selectedResearchId}<ResearchModal
      {tree}
      research={{ id: selectedResearchId, ...tree.researches[selectedResearchId] }}
      {revision}
      onadjust={(change) => adjust(tree, change)}
      onclose={() => (selectedResearchId = null)}
    />{/if}
{:catch}<section class="panel"><p class="form-note">{$t('research_load_error')}</p></section>{/await}

<script>
  import Icon from './Icon.svelte';
  import { t } from '../state/preferences.ts';
  let { skill, localized } = $props();
</script>

<article class="hero-skill">
  <span class="hero-skill-slot"
    >{#if skill.icon}<img src={skill.icon} alt="" />{:else}<Icon name="sparkles" />{/if}</span
  >
  <div class="hero-skill-content">
    <strong>{localized?.name || skill.name}</strong><span
      >{localized?.type || $t('hero_skill_' + skill.type.replaceAll('-', '_'))}</span
    >
    <div class="hero-skill-details">
      <small>{$t('hero_unlock_level')} {skill.unlockLevel}</small><small
        >{$t('hero_skill_max_level')} {skill.maxLevel}</small
      >{#if skill.damage}<small>{$t('hero_damage_' + skill.damage)}</small>{/if}<small
        >{$t('hero_skill_slot')} {skill.slot}</small
      >
    </div>
    {#if localized}<section class="localized-skill">
        {#if localized.cooldownSeconds}<small class="localized-skill-cooldown"
            >{$t('hero_cooldown')} {localized.cooldownSeconds} {$t('second_short')}</small
          >{/if}
        <p>{localized.description}</p>
        {#if localized.upgrades.length}<ul>
            {#each localized.upgrades as upgrade}<li>
                {upgrade.text}{#if upgrade.unlockHeroStars}
                  <span>({$t('hero_unlock_at')} {upgrade.unlockHeroStars}★)</span>{/if}
              </li>{/each}
          </ul>{/if}{#if localized.unlockHeroLevel}<p class="localized-skill-unlock">
            {$t('hero_unlock_at')}
            {$t('level_abbr')}
            {localized.unlockHeroLevel} · {localized.unlockHeroStars}★
          </p>{/if}
      </section>{/if}
    <details class="skill-progression">
      <summary>{$t('hero_view_progression')} ({skill.starTiers.length})</summary
      >{#each skill.starTiers as tier}<section class="skill-tier">
          <h5>
            {$t('hero_skill_star')}
            {tier.skillStar} · {$t('hero_stars_required')}
            {tier.unlockHeroStar}{#if tier.uniqueEquipmentStar !== null}
              · {$t('hero_unique_equipment')} {tier.uniqueEquipmentStar}{/if}
          </h5>
          {#if tier.levels.length}<div class="table-wrap">
              <table>
                <thead><tr><th>{$t('level')}</th><th>{$t('hero_skill_values')}</th></tr></thead><tbody
                  >{#each tier.levels as point}<tr
                      ><td>{point.level}</td><td>{point.parameters.join(' / ') || '—'}</td></tr
                    >{/each}</tbody
                >
              </table>
            </div>{:else}<p>{$t('hero_skill_values')}: {tier.parameters.join(' / ') || '—'}</p>{/if}
        </section>{/each}
    </details>
  </div>
</article>

<script>
  import { t, number } from '../state/preferences.ts';
  let { table } = $props();
</script>

{#if table}<div class="duel-level-table">
    <h4>{$t(table.labelKey)}</h4>
    <div class="table-wrap">
      <table>
        <thead
          ><tr
            ><th>{$t('level')}</th>{#each table.pointsByLevel as _, index}<th>{index + 1}</th>{/each}</tr
          ></thead
        ><tbody
          ><tr
            ><td>{$t('duel_points_per_unit')}</td>{#each table.pointsByLevel as points}<td
                >{$number(points)}</td
              >{/each}</tr
          ></tbody
        >
      </table>
    </div>
  </div>{/if}

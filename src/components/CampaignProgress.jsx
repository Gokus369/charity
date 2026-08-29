import { campaign } from '../data/content.js';
import { CONFIG, money } from '../payments.js';

function daysLeft(deadline) {
  const end = new Date(`${deadline}T23:59:59`);
  return Math.ceil((end - new Date()) / 86400000);
}

export default function CampaignProgress() {
  const { name, goalMeals, deadline, mealsFunded } = campaign;

  const pct = Math.min(100, Math.round((mealsFunded / goalMeals) * 100));
  const remaining = Math.max(0, goalMeals - mealsFunded);
  const days = daysLeft(deadline);
  const goalRupees = goalMeals * CONFIG.costPerMeal;

  return (
    <div className="goal">
      <div className="goal-head">
        <h3>
          {goalMeals.toLocaleString(CONFIG.locale)} meals by {name}
        </h3>
        <span className="goal-pct">{pct}%</span>
      </div>

      <div
        className="goal-bar"
        role="progressbar"
        aria-valuenow={mealsFunded}
        aria-valuemin={0}
        aria-valuemax={goalMeals}
        aria-label={`${mealsFunded} of ${goalMeals} meals funded`}
      >
        <span style={{ width: `${pct}%` }} />
      </div>

      <p className="goal-meta">
        <strong>{mealsFunded.toLocaleString(CONFIG.locale)}</strong> funded ·{' '}
        <strong>{remaining.toLocaleString(CONFIG.locale)}</strong> to go ·{' '}
        {days > 0 ? (
          <>
            <strong>{days}</strong> day{days === 1 ? '' : 's'} left
          </>
        ) : (
          <strong>closed</strong>
        )}
      </p>

      <p className="goal-note">
        That is {money(goalRupees)} in total{days > 0 && <> — about {money(Math.ceil(goalRupees / days))} a day from here</>}.
      </p>
    </div>
  );
}

(() => {
document.querySelectorAll('[data-planner-app]').forEach(app => {
  const spreads = [...app.querySelectorAll('[data-planner-spread]')];
  const tabs = [...app.querySelectorAll('[data-planner-tab]')];
  const openSpread = (idx) => {
    spreads.forEach(s => s.classList.toggle('active', Number(s.dataset.plannerSpread) === idx));
    tabs.forEach(t => t.classList.toggle('active', Number(t.dataset.plannerTab) === idx));
  };
  tabs.forEach(tab => tab.addEventListener('click', () => openSpread(Number(tab.dataset.plannerTab))));
});
})();

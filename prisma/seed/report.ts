export interface ISeedReport {
  created: string[];
  skipped: string[];
}

export const createSeedReport = (): ISeedReport => ({
  created: [],
  skipped: [],
});

export const markCreated = (report: ISeedReport, label: string) => {
  report.created.push(label);
};

export const markSkipped = (report: ISeedReport, label: string) => {
  report.skipped.push(label);
};

export const printSeedSummary = (report: ISeedReport) => {
  console.log('');
  if (report.created.length > 0) {
    console.log('Создано:');
    for (const item of report.created) console.log(`  • ${item}`);
  } else {
    console.log('Создано: ничего нового.');
  }

  if (report.skipped.length > 0) {
    console.log('Пропущено (уже есть):');
    for (const item of report.skipped) console.log(`  • ${item}`);
  }
  console.log('');
};

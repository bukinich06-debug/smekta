export class EstimateItemDeleteBlockedError extends Error {
  readonly actNumbers: string[];

  constructor(actNumbers: string[]) {
    super('ESTIMATE_ITEM_DELETE_BLOCKED');
    this.name = 'EstimateItemDeleteBlockedError';
    this.actNumbers = actNumbers;
  }
}

export class EstimateSectionDeleteBlockedError extends Error {
  readonly actNumbers: string[];

  constructor(actNumbers: string[]) {
    super('ESTIMATE_SECTION_DELETE_BLOCKED');
    this.name = 'EstimateSectionDeleteBlockedError';
    this.actNumbers = actNumbers;
  }
}

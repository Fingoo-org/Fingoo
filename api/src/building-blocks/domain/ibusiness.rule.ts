export interface IBusinessRule {
  IsBroken(): boolean;

  get Message(): string;
}

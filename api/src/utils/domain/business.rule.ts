export interface BusinessRule {
  isBroken(): boolean;

  get Message(): string;
}

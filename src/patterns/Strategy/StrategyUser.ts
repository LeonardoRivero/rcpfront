export class ContextUser {
  private strategy: StrategyUser;
  constructor(strategy: StrategyUser) {
    this.strategy = strategy;
  }
  public setStrategy(strategy: StrategyUser) {
    this.strategy = strategy;
  }
  public doSomeBusinessLogic(): void {
    // console.log(
    //   "Context: Sorting data using the strategy (not sure how it'll do it)"
    // );
    const result = this.strategy.setPermission();
    // console.log(result.join(','));
  }
}

interface StrategyUser {
  setPermission(): void;
}

export class ConcreteStrategyA implements StrategyUser {
  public setPermission(): void {
    // return data.sort();
  }
}

export class ConcreteStrategyB implements StrategyUser {
  public setPermission(): void {
    // return data.reverse();
  }
}

// const context = new ContextUser(new ConcreteStrategyA());
// console.log('Client: Strategy is set to normal sorting.');
// context.doSomeBusinessLogic();

// console.log('');

// console.log('Client: Strategy is set to reverse sorting.');
// context.setStrategy(new ConcreteStrategyB());
// context.doSomeBusinessLogic();

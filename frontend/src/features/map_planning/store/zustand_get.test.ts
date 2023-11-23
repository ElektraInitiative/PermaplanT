import { create } from 'zustand';

type State = {
  val: number;
  step: number;
  history: number[];
  exec: (v: number) => void;
};

const state = create<State>()((set, get) => {
  return {
    val: 0,
    step: 0,
    history: [],
    exec: (v: number) => {
      const snap = get();

      setTimeout(() => {
        // simulate an error for the action with value 2
        // erroring should revert the state to the last valid state before the error
        if (v === 2) {
          set(snap);
        }
      }, 500);

      set((s) => ({ ...s, val: v, history: [...s.history, v], step: s.step + 1 }));
    },
  };
});

test("zustand's get() returns a copy not a reference", async () => {
  const { exec } = state.getState();
  exec(1);
  exec(2);
  exec(3);

  // wait for the 'error'
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { val, history, step } = state.getState();

  expect(val).toBe(1);
  expect(history).toEqual([1]);
  expect(step).toBe(1);
});

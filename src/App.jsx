/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  loanActive: null,
};

function reducerFn(state, action) {
  console.log("state", state);
  console.log("action", action);

  switch (action.type) {
    case "open":
      console.log("open account");
      return { ...state, balance: 50, isActive: true };
    case "deposit":
      console.log("deposit 150");
      return { ...state, balance: state.balance + action.payload };
    case "withdraw":
      console.log("withdraw 50");
      return {
        ...state,
        balance:
          state.balance >= action.payload
            ? state.balance - action.payload
            : state.balance,
      };
    case "loan":
      console.log("loan 5000");
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: state.loan + action.payload,
        balance: state.balance + action.payload,
        loanActive: true,
      };
    case "payloan":
      if (state.loan === 0 || state.balance < state.loan) return state;
      return {
        ...state,
        balance:
          state.balance >= state.loan
            ? state.balance - state.loan
            : state.balance,
        loan: 0,
        loanActive: state.loan === 0 ? null : false,
      };
    case "close":
      console.log("close account");
      if (state.balance > 0) return state;
      return {
        ...state,
        balance: 0,
        loan: 0,
        isActive: false,
        loanActive: null,
      };
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducerFn, initialState);

  const { balance, isActive, loan, loanActive } = state;

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: "open" });
          }}
          disabled={isActive ? true : false}
        >
          Open account
        </button>
      </p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: "deposit", payload: 150 });
          }}
          disabled={isActive ? false : true}
        >
          Deposit 150
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "withdraw", payload: 50 });
          }}
          disabled={isActive ? false : true}
        >
          Withdraw 50
        </button>
      </p>
      <p>
        {!loanActive && (
          <button
            onClick={() => {
              dispatch({ type: "loan", payload: 5000 });
            }}
            disabled={isActive ? false : true}
          >
            Request a loan of 5000
          </button>
        )}
      </p>
      <p>
        <button
          onClick={() => {
            loan && dispatch({ type: "payloan" });
          }}
          disabled={isActive ? false : true}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "close" });
          }}
          disabled={isActive ? false : true}
        >
          Close account
        </button>
      </p>
    </div>
  );
}

import { useActionState } from "react";
import supabase from "../supabase-client";
import { useAuth } from "../context/AuthContext";

export const Form = ({ metrics }) => {
  const { users } = useAuth();
 console.log(users)
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const currentUser = users.find(user => user.name === formData.get("name"))
      //Action logic
      const newDeal = {
        user_id: currentUser.id,
        value: formData.get("value"),
      }

      const { error } = await supabase
      .from('sales_deals')
      .insert(newDeal); 

      if (error) {
        console.error('Error inserting data:', error);
        return new Error(error)
      } 
    }, null // inital state
  )

  const generateOptions = () => {
    return users.map((user) => (
      <option key={user.id} value={user.name}>
        {user.name}
      </option>
    ));
  };

  return (
    <div className="add-form-container">
      <form
      action={submitAction}
        aria-label="Add new sales deal"
        aria-describedby="form-description"
      >
        <div id="form-description" className="sr-only">
          Use this form to add a new sales deal. Select a sales rep and enter
          the amount.
        </div>

        <label htmlFor="deal-name">
          Name:
          <select
            id="deal-name"
            name="name"
            defaultValue={metrics?.[0]?.name || ''}
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            disabled={isPending}
          >
            {generateOptions()}
          </select>
        </label>

        <label htmlFor="deal-value">
          Amount: $
          <input
            id="deal-value"
            type="number"
            name="value"
            defaultValue={0}
            className="amount-input"
            min="0"
            step="10"
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            disabled={isPending}
            aria-label="Deal amount in dollars"
          />
        </label>

        <button 
          type="submit" 
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? "Adding..." : "Add Deal"}
        </button>
      </form>
      {error && (
        <div role='alert' className="error-message">
          {error.message}
        </div>
      )}
    </div>
  );
};

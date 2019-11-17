import * as React from 'react';

/**
 * A hook that invokes a function when state change.
 * A object containing the next state and possible callback depency variables
 * are passed to the callback as arguments.
 * @param state Observed state.
 * @param callback Action to invoke when state changes.
 * @param options Callback depent variables.
 */

export function useStateChange(state: any, callback: Function, options?: any) {
    React.useEffect(() => {
        if (state == null) return;
        callback({ nextState: state, options });
    }, [state]);
}
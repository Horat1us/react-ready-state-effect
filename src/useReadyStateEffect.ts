import { DependencyList, EffectCallback, useEffect } from "react";
import { isReadyStateMatch } from "./isReadyStateMatch";
import { ExpectedReadyState } from "./ExpectedReadyState";

export const useReadyStateEffect = (
    effect: EffectCallback,
    deps: DependencyList = [],
    expectedReadyState: ExpectedReadyState = "complete"
): void => {
    useEffect(() => {
        const destructors: Array<() => void> = [
            () => document.removeEventListener("readystatechange", listener),
        ];

        const listener = () => {
            if (!isReadyStateMatch(expectedReadyState)) {
                return;
            }
            const destructor = effect();
            if (destructor) {
                destructors.push(destructor);
            }
        };

        listener();
        document.addEventListener("readystatechange", listener);

        return () => destructors.forEach((d) => d());
    }, [deps]);
};

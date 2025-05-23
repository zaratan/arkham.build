import { createContext, useContext, useMemo, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { CardModal } from "./card-modal";

type CardModalContextConfig = {
  code: string;
};

type CardModalContextState =
  | {
      isOpen: true;
      config: CardModalContextConfig;
    }
  | {
      isOpen: false;
      config: CardModalContextConfig | undefined;
    };

type CardModalContext = {
  isOpen: boolean;
  setClosed: () => void;
  setOpen: (config: CardModalContextConfig) => void;
};

const CardModalContext = createContext<CardModalContext>({
  isOpen: false,
  setClosed: () => {},
  setOpen: () => {},
});

export function useCardModalContextChecked() {
  const context = useContext(CardModalContext);

  if (!context) {
    throw new Error(
      "useCardModalContextChecked must be used within a CardModalProvider.",
    );
  }
  return context;
}

export function useCardModalContext() {
  return useContext(CardModalContext);
}

type Props = {
  children: React.ReactNode;
};

export function CardModalProvider(props: Props) {
  const [state, setState] = useState<CardModalContextState>({
    isOpen: false,
    config: undefined,
  });

  const value: CardModalContext = useMemo(
    () => ({
      isOpen: state.isOpen,
      setClosed: () => {
        setState((prev) => ({ isOpen: false, config: prev.config }));
      },
      setOpen: (config: CardModalContextConfig) => {
        setState({ config, isOpen: true });
      },
    }),
    [state.isOpen],
  );

  return (
    <CardModalContext.Provider value={value}>
      {props.children}
      <Dialog onOpenChange={value.setClosed} open={state.isOpen}>
        <DialogContent>
          {state.config && <CardModal {...state.config} />}
        </DialogContent>
      </Dialog>
    </CardModalContext.Provider>
  );
}

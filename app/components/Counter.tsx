"use client";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export function Counter({name}:{name:string}) {
  const [Amount, setAmount] = useState(0);

  function increase() {
    setAmount(Amount + 1);
  }
  function decrease() {
    if (Amount > 0) {
      setAmount(Amount - 1);
    }
  }
  return (
    <div className="flex items-center gap-x-4">
        <input type="hidden" name={name} value={Amount}/>
      <Button variant="outline" size="icon" type="button" onClick={decrease}>
        <Minus className="h-4 w-4 text-primary" />
      </Button>
      <p className="font-medium text-lg">{Amount}</p>
      <Button variant="outline" size="icon" type="button" onClick={increase}>
        <Plus className="h-4 w-4 text-primary" />
      </Button>
    </div>
  );
}

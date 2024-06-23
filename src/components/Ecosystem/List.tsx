import { JSX } from "react";
import Card from "./Card";
import { GraphNode } from "@/types/api";

export function List(node: GraphNode) {
  console.log(node);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="min-h-32 flex w-full max-w-[1440px] flex-col gap-10 px-8 pb-32">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-4">
          <Card {...node} key={node.id} />
        </div>
      </div>
    </div>
  );
}

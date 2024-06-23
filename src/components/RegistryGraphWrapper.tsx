import dynamic from "next/dynamic";

const RegistryGraph = dynamic(() => import("./RegistryGraph"), {
  ssr: false
});

export default RegistryGraph;
import { Canvas } from "@react-three/fiber";
import styles from "./index.module.css";

export function ItemSandbox() {
  return (
    <div className={styles.wrapper}>
      <Canvas className={styles.canvas}></Canvas>
    </div>
  );
}

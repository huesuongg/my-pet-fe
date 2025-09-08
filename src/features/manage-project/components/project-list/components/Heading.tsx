import styles from "./Heading.module.css";
export const Heading = (): JSX.Element => {


  return (
    <div className={`${styles["heading-wrapper"]}`}>
      <h2>Manage Projects</h2>
    </div>
  );
};

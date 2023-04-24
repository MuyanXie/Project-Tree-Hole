import classes from "./SmallModal.module.css";

function SmallModal({ children }) {
  return (
    <>
      <div className={classes.backdrop}>
        <dialog open className={classes.modal}>
          {children}
        </dialog>
      </div>
    </>
  );
}

export default SmallModal;

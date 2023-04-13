import React, { useEffect, useState } from "react";
import classes from "./Testdisplaypost.module.css";

const Testdisplaypost = (tree) => {

    return (
        <div>
            <h1>Testdisplaypost</h1>
            <div className={classes.post}>
                <p>author</p>
                <p>text</p>
            </div>
        </div>
    );
}

export default Testdisplaypost;
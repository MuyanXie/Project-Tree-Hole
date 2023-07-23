// Remind: Do you want to use SSO to sign in to Spring (Tree Hole Friends Network) ?

import Header from "../display/Header";

const SSO = () => {

    const onClick = () => {
    }

    return (
        <div>
            <Header name="Spring Signin" />
            <BoxWrapper>
                <Box>
                    <h1>Spring Signin</h1>
                </Box>
            </BoxWrapper>
            <button onClick={onClick}>Sign in with Tree Hole</button>
        </div>
    );
}

export default SSO;
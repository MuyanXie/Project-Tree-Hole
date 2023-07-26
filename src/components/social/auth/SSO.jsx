// Remind: Do you want to use SSO to sign in to Spring (Tree Hole Friends Network) ?

import { Typography, styled } from "@mui/material";
import { auth } from "../../../firebase";
import axios from "axios";
import { dev_host as host } from "../social_config";
import Header from "../../display/Header";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import CustomPrimaryButton from "../../utils/CustomPrimaryButton";
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
const BoxWrapper = styled("div")({
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#5865F2",
});

const SSO = () => {

    const navigate = useNavigate();

    const onClick = () => {
        // add logic
        const send_jwt = async () => {
            const token = await auth.currentUser.getIdToken(true)
            // console.log(token);
            await axios.post(`${host}/api/auth/login`, {
                mail : auth.currentUser.email,
                token : token,
                username : auth.currentUser.displayName,
                fireid : auth.currentUser.uid,
            }, {
                headers: {
                    Authorization: token
                }
            }
            )
            .then((res) => {
                console.log(res);
                if(res.status === 200){
                    const userDetails = {
                        mail : res.data.userDetails.mail,
                        token : res.data.userDetails.token,
                        username : res.data.userDetails.username,
                        userId : res.data.userDetails._id,
                    }
                    localStorage.setItem("user", JSON.stringify(userDetails));
                    navigate("/socialdashboard");
                }
                else{
                    console.log(res);
                }

            }
            )
        }
        send_jwt();
    }

    return (
        <div>
            <Header name="Spring Signin" />
            <BoxWrapper>
                <Box
                    sx={{
                        width: 500,
                        height: 400,
                        bgcolor: "#36393f",
                        borderRadius: "5px",
                        boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                        display: "flex",
                        flexDirection: "column",
                        padding: "25px",
                    }}
                >
                    <Typography variant="h5" sx={{ color: "white", margin: "center", textAlign: "center" }}>
                        Welcome to Spring System!
                    </Typography>
                    <Typography sx={{ color: "#b9bbbe", textAlign: "center" }}>
                        We are happy that you are with us!
                    </Typography>

                    <Groups2OutlinedIcon sx={{
                        color: "#b9bbbe",
                        fontSize: "130px",
                        marginLeft: "35%",
                        marginTop: "5%",
                        marginBottom: "5%"
                
                    }}  />

                    <div style={{marginBottom: "5%"}}>
                        <CustomPrimaryButton
                            label="Log in with Tree Hole SSO"
                            additionalStyles={{ marginTop: "30px", width: "60%", marginLeft: "20%" }}
                            disabled={false}
                            onClick={onClick}
                        />
                    </div>

                </Box>
            </BoxWrapper>
        </div>
    );
}

export default SSO;
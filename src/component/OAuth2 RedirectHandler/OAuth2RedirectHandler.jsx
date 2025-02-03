// import {useEffect} from "react";
// import {useNavigate, useSearchParams} from "react-router-dom";

//     const OAuth2RedirectHandler = () => {
//     const [searchParams] = useSearchParams();
//     const token = searchParams.get("token");
//     const navigate = useNavigate();
//     useEffect(() => {
//     if (token) {
//     localstorage.setItem("accessToken", token);
//     navigate("/",{ replace: true });
//      } else {
//     navigate("/login", {replace: true});
//      }
//     },[token, navigate]);
//     return <div>t</div>;
// };
//     export default OAuth2RedirectHandler;
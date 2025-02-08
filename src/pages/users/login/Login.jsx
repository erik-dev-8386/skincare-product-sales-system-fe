import Logo from '../../../assets/Logo_01.jpg';
import { login } from '../../../auth';
import "../login/Login.css"
import Google from '../../../assets/google.png';

function Login() {
    return (
        <>
            <form>
                <div className="login">
                    <div className='login-logo'>
                        <a href="/"><img src={Logo} alt="" /></a>
                        <h1>Đăng nhập</h1>

                    </div>
                    <div className='input'>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example1">Tên người dùng:</label>
                            <input type="email" id="form2Example1" className="form-control" />
                        </div>

                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="form2Example2">Mật khẩu:</label>
                            <input type="password" id="form2Example2" className="form-control" />
                        </div>
                    </div>

                    {/* <!-- 2 column grid layout for inline styling --> */}
                    <div className="row mb-4">


                        <div className="text-loss col">
                            {/* <!-- Simple link --> */}

                            <a href="#!">Quên mật khẩu</a>
                        </div>
                    </div>

                    {/* <!-- Submit button --> */}
                    <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn-login btn-light btn-block mb-4">Đăng nhập</button>

                    {/* <!-- Register buttons --> */}
                    <div className="text-center">
                        <p>Bạn không có tài khoản? <a href="/register">Đăng ký</a></p>
                        <p>Hoặc đăng nhập với:</p>


                        <div>
                            <a href="#">
                                <button type="button" onClick={login} data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">

                                    {/* <i className="fab fa-google"></i> */}

                                    <img className='google' src={Google} alt="login-with-google" />
                                    Đăng nhập với google
                                </button>
                            </a>

                        </div>



                    </div>
                </div>
            </form>

        </>
    );
}


export default Login
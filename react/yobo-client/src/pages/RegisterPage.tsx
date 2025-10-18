import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import api from "../lib/api";

const RegisterPage: React.FC = () =>{
    const {login} = useAuth();
    const navigate = useNavigate();

    const[fullName, setFullName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            const res = await api.post("/api/auth/register", {fullName,email,password});

            const { token, email:outEmail, fullName:outName } = res.data;
            login(token, {email: outEmail, fullName:outName});

            navigate("/");
        }catch(err: any){
            setError(err.response?.data?.message || "Kayıt Başarısız.");
        }finally{
            setLoading(false);
        }
    };

     return(
        <div style={{maxWidth: 380, margin: "60px auto", fontFamily: "system-ui"}}>
            <h1>Kayıt Yap</h1>
            <form onSubmit={onSubmit}>
                <label style={{display: "block", marginTop: 12}}>Ad Soyad
                <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} required style={{width: "100%", padding:10, marginTop:12}} />
                </label>
                <label style={{display: "block", marginTop: 12}}>E-posta
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width: "100%", padding:10, marginTop:12}} />
                </label>
                <label style={{display: "block", marginTop: 12}}>Şifre
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width: "100%", padding:10, marginTop:12}} />
                </label>

                {error && <div style={{color: "crimson", marginTop:10}}>{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{width: "100%",padding: 12,marginTop:16,border:0,borderRadius:8,cursor:"pointer"}}
                >
                    {loading ? "Gönderiliyor...":"Giriş Yap"}
                </button>
            </form>
            <p style={{marginTop:12}}>
                Hesabın Varsa <Link to="/login">Giriş Yap</Link>
            </p>
        </div>
    );
}

export default RegisterPage;
import { useEffect, useState } from "react"
import type { BlogItem } from "../type/blog"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../lib/api";

const BlogListPage:React.FC = () => {
    const [items, setItems] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [q,setQ] = useState("");
    const navigate = useNavigate();
    const {user, userId,logout} = useAuth();

    const fetchData = async () => {
        setLoading(true);
        try{
            const res = await api.get<BlogItem[]>("/api/blog",{
                params: {page: 1, pageSize: 20, q: q || undefined,onlyPublished:true},
            });
            setItems(res.data);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {fetchData();},[]);

    const onSearch = (e:React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    const onDelete = async(id:number) => {
        if(!confirm("Bu yazıyı silmek istediğine emin misin?")) return;
        try{
            await api.delete(`/api/blog/${id}`);
            await fetchData();
        }catch(err:any){
            alert(err.response?.data?.message || "Silme başarısız.");
        }
    };

    return(
        <div style={{maxWidth:960, margin: "32px auto"}}>
            <header style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div>
                    <h1 style={{margin:0}}>Blog</h1>
                    <div style={{opacity: 0.8, fontSize:14}}>
                        Hoş Geldin <b>{user?.fullName ?? user?.email ?? "misafir"}</b>
                    </div>
                </div>
                <div style={{display: "flex", gap:8}}>
                    <button onClick={() => navigate("blog/new")} style={{padding:10, border:0, borderRadius:8, cursor:"pointer"}}>+ Yazı Yazı</button>
                    <button onClick={logout} style={{padding:10,border:"1px solid #ddd", borderRadius:8, cursor:"pointer"}}>Çıkış Yap</button>
                </div>
            </header>
            <form onSubmit={onSearch} style={{marginTop:16, display:"flex",gap:8}}>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara.." style={{flex:1, padding:10,borderRadius:8, border:"1px solid #ddd"}}></input>
                <button type="submit" style={{padding: "10px 14px", borderRadius:8,border:0,cursor:"pointer"}}>Ara</button>
            </form>

            {loading ? (
                <p style={{marginTop: 24}}>Yükleniyor...</p>
            ):items.length === 0 ? (
                <p style={{marginTop:25}}>Gösterilecek yazı yok</p>
            ):(
                <div style={{display:"grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr", gap:16,marginTop:24}}>
                    {items.map((b)=>{
                        const mine = userId && b.authorId === userId;
                        return(
                            <div key={b.id} style={{border: "1px solid #eee",borderRadius:12, padding:14}}>
                                <div style={{fontSize:12, opacity:0.7,marginBottom:6}}>
                                    {new Date(b.createdAt).toLocaleString()}
                                    {!b.isPusblished && (<span style={{marginLeft:6, color:"crimson"}}>(Taslak)</span>)}
                                </div>
                                <h3 style={{margin: "4px 0 8px"}}>
                                    <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                                </h3>
                                <div style={{fontSize:13, opacity:0.8, marginBottom:10}}>
                                    {b.authorFullName ?? b.authorEmail ?? ""}
                                </div>
                                <div style={{display: "flex", gap:8, flexWrap: "wrap"}}>
                                    <Link to={`/blog/${b.slug}`} style={{fontSize:14}}>Oku</Link>
                                    {mine && (
                                        <>
                                        <Link to={`/blog/edit/${b.id}`} state={{post: b}} style={{fontSize:14}}> Düzenle</Link>

                                        <button onClick={() => onDelete(b.id)} style={{fontSize:14,border:0,background:"crimson",cursor:"pointer"}}>Sil</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )};
        </div>
    );
}
export default BlogListPage;
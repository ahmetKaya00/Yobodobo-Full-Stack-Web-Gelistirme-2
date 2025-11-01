import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import type { BlogItem } from "../type/blog";
import { useAuth } from "../auth/AuthContext";
import api from "../lib/api";

const BlogDetailPage:React.FC = () => {
    const {slug} = useParams();
    const [post, setPost] = useState<BlogItem | null>(null);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            try{
                const res = await api.get<BlogItem>(`/api/blog/${slug}`);
                setPost(res.data);
            }finally{
                setLoading(false);
            }
        };
        run();
    },[slug]);

    const mine = !!(userId && post && userId === post.authorId);

    const onDelete = async () => {
        if(!post)return;
        if(!confirm("Bu yazıyı silmek istediğine emin misin ?"))return;
        await api.delete(`/api/blog/${post.id}`);
        navigate("/");
    };

    if(loading)
        return(
          <div style={{maxWidth: 760, margin: "32px auto"}}>Yükleniyor...</div>  
        );

    if(!post)
        return(
            <div style={{maxWidth:760, margin: "32px auto"}}>Bulunamadı</div>
        );

    return(
        <div style={{maxWidth:760, margin:"32px auto"}}>
            <div style={{display:"flex", justifyContent: "space-between",alignItems:"start"}}>
                <h1 style={{marginBottom:6}}>{post.title}</h1>
                <Link to="/">Liste</Link>
            </div>

            <div style={{fontSize: 12, opacity:0.7, marginBottom:16}}>
                {new Date(post.createdAt).toLocaleString()}
                {post.authorFullName ?? post.authorEmail ? ". ":" "}
                {post.authorFullName ?? post.authorEmail}

                {!post.isPusblished && (
                    <span style={{marginLeft:6,color:"crimson"}}>(Taslak)</span>
                )}
            </div>

            {mine && (
                <div style={{display: "flex", gap:8,marginTop:24}}>
                    <Link to={`/blog/edit/${post.id}`} state={{post}}style={{padding:"8px 12px",border:"1px solid #ddd",borderRadius:8}}>Düzenle</Link>
                    <button onClick={onDelete} style={{padding:"8px 12px",borderRadius:8,border:0,background:"#ffe5e8",color: "#b30024",cursor:"pointer"}}>Sil</button>
                </div>
            )}
        </div>
    );
}
export default BlogDetailPage;
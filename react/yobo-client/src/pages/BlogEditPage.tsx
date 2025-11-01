// src/pages/BlogEditPage.tsx — Yeni blog yazısı oluşturma veya mevcut bir yazıyı düzenleme sayfası

import React, { useEffect, useState } from "react";              // React ve gerekli hook'lar
import { useLocation, useNavigate, useParams, Link } from "react-router-dom"; 
// useParams → URL'den id/slug gibi parametreleri alır
// useNavigate → sayfa yönlendirmesi yapar
// useLocation → sayfaya geçerken gönderilen state verisini alır
// Link → sayfalar arasında yönlendirme bağlantısı oluşturur

import api from "../lib/api";                                    // Axios instance (API istekleri)
import type { BlogCreateRequest, BlogItem, BlogUpdateRequest } from "../type/blog"; 
// Blog tipleri (oluşturma/güncelleme nesneleri)

type NavState = { post?: BlogItem };                             // Liste sayfasından "state" ile gönderilen post tipi

// Ana bileşen: BlogEditPage
const BlogEditPage: React.FC = () => {
  const { id } = useParams();               // URL'deki :id parametresini al (örneğin /blog/edit/12)
  const { state } = useLocation() as { state: NavState }; // useLocation ile state üzerinden gelen post'u al
  const navigate = useNavigate();           // navigate → sayfa yönlendirmesi için kullanılır

  const editing = !!id;                     // Eğer id varsa, düzenleme modundayız
  const initial = state?.post;              // Eğer liste sayfasından "Düzenle" ile gelindiyse, post bilgisi state içindedir

  // Form alanlarını ve durum değişkenlerini tanımla
  const [title, setTitle] = useState(initial?.title ?? "");              // Başlık input'u
  const [content, setContent] = useState(initial?.content ?? "");        // İçerik textarea'sı
  const [isPublished, setIsPublished] = useState<boolean>(initial?.isPusblished ?? true); // Yayın durumu
  const [busy, setBusy] = useState(false);                               // API isteği sırasında butonu devre dışı bırakmak için
  const [error, setError] = useState<string | null>(null);               // Hata mesajı

  // Eğer kullanıcı doğrudan /blog/edit/:id adresine giderse (state yoksa), uyarı göster
  useEffect(() => {
    if (editing && !initial) {
      setError("Düzenleme için lütfen liste sayfasından 'Düzenle' ile gelin.");
    }
  }, [editing, initial]); // sadece editing veya initial değişirse çalışır

  // Form gönderildiğinde çalışır (Yeni kayıt veya güncelleme)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();             // Formun sayfayı yenilemesini engeller
    setBusy(true);                  // Butonu devre dışı yap
    setError(null);                 // Önceki hataları temizle

    try {
      if (editing) {                // ✏️ Düzenleme modu
        const dto: BlogUpdateRequest = { title, content, isPublished }; // Gönderilecek DTO
        await api.put(`/api/blog/${id}`, dto); // PUT isteği ile API'ye güncelleme gönder
        // slug değişmiş olabilir; yeni slug bilinmediği için detaya gitmek yerine ana sayfaya dön
        navigate("/");
      } else {                      // 🆕 Yeni yazı oluşturma modu
        const dto: BlogCreateRequest = { title, content, isPublished }; // Yeni kayıt DTO'su
        const res = await api.post("/api/blog", dto); // POST isteği gönder
        // Backend CreatedAtAction ile yeni yazının slug’ını döner → detaya yönlendir
        navigate(`/blog/${res.data.slug}`);
      }
    } catch (err: any) {            // ❌ Hata durumunda
      // Backend tarafında message veya errors dizisi olabilir → hangisi varsa göster
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          "İşlem başarısız."
      );
    } finally {
      setBusy(false);               // İstek tamamlanınca butonu tekrar aktif et
    }
  };

  // ------------------------------ JSX (UI kısmı) ------------------------------
  return (
    <div style={{ maxWidth: 760, margin: "32px auto", fontFamily: "system-ui" }}>
      {/* Sayfa başlığı ve geri dön linki */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <h1 style={{ marginBottom: 6 }}>
          {editing ? "Yazıyı Düzenle" : "Yeni Yazı"} {/* Başlık moduna göre değişir */}
        </h1>
        <Link to="/">← Liste</Link> {/* Ana listeye geri dönüş linki */}
      </div>

      {/* Hata mesajı kutusu */}
      {error && (
        <div
          style={{
            background: "#fff2f2",
            color: "#b30024",
            border: "1px solid #ffd6d9",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* Form alanları */}
      <form onSubmit={onSubmit}>
        {/* Başlık input’u */}
        <label style={{ display: "block", marginTop: 12 }}>
          Başlık
          <input
            value={title}                             // State’ten gelen başlık değeri
            onChange={(e) => setTitle(e.target.value)}// Kullanıcı yazdıkça state güncellenir
            required                                  // Boş bırakılamaz
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        {/* İçerik alanı */}
        <label style={{ display: "block", marginTop: 12 }}>
          İçerik
          <textarea
            value={content}                           // State’ten gelen içerik
            onChange={(e) => setContent(e.target.value)} // Yazdıkça güncellenir
            required                                  // Boş olamaz
            rows={12}                                 // Yüksekliği 12 satır
            style={{ width: "100%", padding: 10, marginTop: 6, fontFamily: "inherit" }}
          />
        </label>

        {/* Yayın durumu kutusu */}
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <input
            type="checkbox"
            checked={isPublished}                     // Checkbox state
            onChange={(e) => setIsPublished(e.target.checked)} // Değişiklikte state güncellenir
          />
          Yayınla (taslak için kapat)                 {/* Açıklama */}
        </label>

        {/* Kaydet / Güncelle butonu */}
        <button
          type="submit"
          disabled={busy}                             // API isteği sırasında devre dışı
          style={{
            padding: "12px 16px",
            marginTop: 16,
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {/* Buton metni mod durumuna göre değişir */}
          {busy ? "Kaydediliyor…" : editing ? "Güncelle" : "Yayınla"}
        </button>
      </form>
    </div>
  );
};

export default BlogEditPage; // Bileşeni dışa aktar, router'da kullanılacak
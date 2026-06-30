(async ()=>{
  try{
    const res = await fetch('http://localhost:8000/', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({vendor: 'Local Test', note: 'Great service, honest pricing'})
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  }catch(e){
    console.error('Fetch error:', e);
  }
})();

const request = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/eligibility/verify',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjgwN2E2MmY3LTBmMTItNDhiMS1hN2IxLTdkZDQ1MmI4MWM0MiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL21ha2psbWpydHVtc3pvYXN4ZG92LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJjYmMxZDlmNC1hODNmLTQzY2ItYmQ2Ni03YWU3Njg3YWE5N2IiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzczNjgyMzkzLCJpYXQiOjE3NzM2Nzg3OTMsImVtYWlsIjoiZGVtbzAwMkBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiZGVtbzAwMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6ImRlbW8wMDIiLCJuaWQiOiJkZW1vMDAyIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJyb2xlIjoiY2l0aXplbiIsInN1YiI6ImNiYzFkOWY0LWE4M2YtNDNjYi1iZDY2LTdhZTc2ODdhYTk3YiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzczNjc4NzkzfV0sInNlc3Npb25faWQiOiIwMmY3ZjcwYS0xNWYxLTQ5MDAtOTQ5My1jYTliMTgyNjk2NWMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.eTE1VmRmnABecCpfVQwLieK5s4lhD-WPwaBaOawckKlBNIulbdSJ-4xoHBVKjQ6hc_-2otvQ3EExv8UOjvsFIQ'
  }
};

const req = request.request(options, res => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Status:', res.statusCode, 'Data:', data));
});

req.on('error', error => console.error(error));
req.end();

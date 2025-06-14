import React from 'react';

function Home({ toggleSidebar }) {
  return (
    <div className="home-content">
      <button className="menu-toggle" onClick={toggleSidebar}>☰</button>
      <h1>Bem-vindo ao Dashboard</h1>
      {/* Conteúdo do Dashboard */}
    </div>
  );
}

export default Home;

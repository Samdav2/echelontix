import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">ECHELONTIX</div>
      <nav className="nav">
        <a href="#">Home</a>
        <a href="#">Event</a>
        <a href="#">About us</a>
        <a href="#">Contacts</a>
        <a href="#">Book Tickets</a>
        <a href="#">Terms</a>
      </nav>
      <div className="ticket-btn">
        <button className="yellow-btn">Tickets</button>
      </div>
    </header>
  );
};

export default Header;
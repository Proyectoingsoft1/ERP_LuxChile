import { useLocation, Link } from 'react-router-dom';

const Navbar = () =>{
    const location = useLocation();
  const id = location.state?.id || 'Invitado';
    
    function Button(props) {
        return(
            <Link to={props.Page} state={{id}}>
                <button className='button'>{props.label}</button>
            </Link>
        )
    }
    
    return (
        <ul className='Navbar'>
            <Button label="Bodegas" Page="/Bodegas"/>
            <Button label="Rutas" Page="/Rutas"/>  
            <Button label="Trabajadores" Page="/Trabajadores"/>          
            <Button label="Cuenta" Page="/Cuenta"/>
        </ul>
    )
}

export default Navbar;
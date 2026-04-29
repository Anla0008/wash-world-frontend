const NavBar = () => {

    const li = [
        { name: "dashboard", link: "/", icon:"https://washworld.dk/assets/icons/washworld-marker.svg" },
        { name: "favoritter", link: "/favoritter", icon:"https://washworld.dk/assets/icons/washworld-marker.svg"  },
        { name: "scan", link: "/scan", icon:"https://washworld.dk/assets/icons/washworld-marker.svg"  },
        { name: "kort", link: "/kort",  icon:"https://washworld.dk/assets/icons/washworld-marker.svg"   },
        { name: "profil", link: "/profil",  icon:"https://washworld.dk/assets/icons/washworld-marker.svg"  }
    ];

    return ( 
        <nav className="fixed bottom-0 left-0 right-0 p-5">
            <ul className="flex justify-between items-center">
               {li.map((item, index) => (
                <li key={index}><a href={item.link} aria-label={item.name}></a>
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
                </li>
               ))}
            </ul>
        </nav>
     );
}
 
export default NavBar;
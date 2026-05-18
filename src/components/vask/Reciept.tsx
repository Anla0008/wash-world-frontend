const Reciept = () => {
    return ( 
        <div>
            <div className="flex flex-col gap-2">
                <h1 className="extra-bold">Dato</h1>
                <p>Tak fordi du vasker med os!</p>
            </div>

            <div>
                <h2 className="extra-bold">Din vask</h2>
                <div className="flex gap-2">
                    <p className="extra-bold">Dato:</p>
                    <p>Dato</p>
                </div>
                <div className="flex gap-2">
                    <p className="extra-bold">Starttidspunkt:</p>
                    <p>Kl</p>
                </div>
                  <div className="flex gap-2">
                    <p className="extra-bold">Sluttidspunkt:</p>
                    <p>kl</p>
                </div>
                 <div className="flex gap-2">
                    <p className="extra-bold">Vasktype:</p>
                    <p>type</p>
                </div>
            </div>
        </div>
     );
}
 
export default Reciept;
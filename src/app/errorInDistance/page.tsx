import NearestWashCard from "@/components/dashboard/NearestWash";

const ErrorInDistancePage = () => {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
                <h1 className="extra-bold">
                    Ingen vaskehaller i nærheden
                </h1>
                <p>
                    Du skal befinde dig på en WashWorld lokation for at starte en vask.
                </p>
            </div>
            <div className="flex flex-col justify-baseline">
                <NearestWashCard />
            </div>
        </div>
     );
}
 
export default ErrorInDistancePage;
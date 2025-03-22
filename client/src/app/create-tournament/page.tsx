import AuthWrapper from "../../components/AuthWrapper";
import TournamentForm from "../../components/TournamentForm";

export default function CreateTournamentPage() {
    return (
        <AuthWrapper>
            <div className="flex justify-center items-center min-h-screen">
                <TournamentForm />
            </div>
        </AuthWrapper>
    );
}

import {FC, useState, FormEvent} from 'react';
import {Role, InvitationData} from "../../types";
import {inviteMember} from "../../services/teamServices.ts";

interface InviteMemberFormProps {
    shopId: string;
    roles: Role[];
    onFormSubmit: () => void;
}

const InviteMemberForm: FC<InviteMemberFormProps> = ({shopId, roles, onFormSubmit}) => {
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState<string>(roles[0]?.id || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!roleId || roleId.trim() === '') {
            setError("Por favor, selecciona un rol.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const invitationData: InvitationData = {shopId, email, roleId};
            const invitationId = await inviteMember(invitationData);
            // Abrimos una nueva ventana para que el empleado se registre o inicie sesión.
            const claimUrl = `/employee-claim?invitationId=${invitationId}&shopId=${shopId}&email=${encodeURIComponent(email)}`;
            const windowFeatures = "width=500,height=650,popup=true";
            window.open(claimUrl, "_blank", windowFeatures);
            onFormSubmit();
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al enviar la invitación.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email del Miembro</label>
                <input type="email" className="form-control" id="email" value={email}
                       onChange={(e) => setEmail(e.target.value)} placeholder="empleado@correo.com" required/>
            </div>
            <div className="mb-3">
                <label htmlFor="roleId" className="form-label">Asignar Rol</label>
                <select className="form-select" id="roleId" value={roleId} onChange={(e) => setRoleId(e.target.value)}
                        required>
                    <option value="" disabled>Selecciona un rol...</option>
                    {roles.map(role => (<option key={role.id} value={role.id}>{role.name}</option>))}
                </select>
            </div>
            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Invitación'}
                </button>
            </div>
        </form>
    );
};

export default InviteMemberForm;
import {FC, useState, FormEvent} from 'react';
import {Role} from "../../types";
import {inviteMember} from "../../services/teamServices";

interface InviteMemberFormProps {
    shopId: string;
    roles: Role[];
    onFormSubmit: () => void;
}

const AddMemberForm: FC<InviteMemberFormProps> = ({shopId, roles, onFormSubmit}) => {
    const [email, setEmail] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedRoleId) {
            setError("Por favor, selecciona un rol.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await inviteMember(shopId, email, selectedRoleId);
            onFormSubmit();
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
                <label htmlFor="memberEmail" className="form-label">Email del Miembro</label>
                <input type="email" className="form-control" id="memberEmail"
                       value={email} onChange={e => setEmail(e.target.value)}
                       placeholder="ejemplo@correo.com" required/>
            </div>
            <div className="mb-3">
                <label htmlFor="memberRole" className="form-label">Asignar Rol</label>
                <select className="form-select" id="memberRole"
                        value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)} required>
                    <option value="" disabled>Selecciona un rol...</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Invitando...' : 'Agregar Miembro'}
                </button>
            </div>
        </form>
    );
};

export default AddMemberForm;
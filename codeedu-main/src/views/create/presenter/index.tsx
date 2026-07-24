import StatCount from '../partials/stat-count';
import Sessions from '@faculty/dashboard/sessions';
import AssignedProgram from '../partials/assigned-program';

const index = () => {
    return (
        <div className="flex flex-col gap-6">
            <StatCount />
            <Sessions />
            <AssignedProgram />
        </div>
    )
}

export default index
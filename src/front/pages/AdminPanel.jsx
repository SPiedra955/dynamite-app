
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import services from "../services/apiServices";

export const AdminPanel = () => {

    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        services.getSubscribers().then(data => {
            dispatch({
                type: "getSubs",
                payload: data.data
            });
        });
    }, []);

    const subscribers = store.subs || [];
    const total = subscribers.length;
    const active = subscribers.filter(
    s => s.subscription?.active
).length;

const inactive = total - active;

    return (
        <div className="d-flex min-vh-100 bg-dark text-white">

            {/* SIDEBAR */}
            <div className="bg-black p-3" style={{ width: "220px" }}>
                <h4 className="mb-4">Admin</h4>

                <p className="text-secondary">Dashboard</p>
                <p className="text-secondary">Users</p>
                <p className="text-secondary">Subscriptions</p>
                <p className="text-secondary">Plans</p>
            </div>

            {/* MAIN */}
            <div className="flex-grow-1 p-4">

                <h2 className="mb-4">Dashboard Overview</h2>

                {/* STATS */}
                <div className="row mb-4">

                    <div className="col-md-4">
                        <div className="card bg-black border-secondary p-3">
                            <h5>Total Users</h5>
                            <h2>{total}</h2>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-black border-success p-3">
                            <h5>Active Subs</h5>
                            <h2 className="text-success">{active}</h2>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card bg-black border-danger p-3">
                            <h5>Inactive Subs</h5>
                            <h2 className="text-danger">{inactive}</h2>
                        </div>
                    </div>

                </div>

                {/* TABLE */}
                <div className="card bg-black border-secondary p-3">

                    <h4 className="mb-3">Subscriptions</h4>

                    <div className="table-responsive">

                        <table className="table table-dark table-hover align-middle">

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Plan</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Ends</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {subscribers.map((sub) => (
                                    <tr key={sub.user.id}>
                                        <td>{sub.user.name}</td>
                                        <td>{sub.user.email}</td>

                                        <td>
                                            {sub.plan ? sub.plan.name : "Sin plan"}
                                        </td>

                                        <td>
                                            <span
                                                className={`badge ${sub.subscription?.active
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                                    }`}
                                            >
                                                {sub.subscription?.active
                                                    ? "Active"
                                                    : "No subscription"}
                                            </span>
                                        </td>

                                        <td>
                                            {sub.subscription?.created_at
                                                ? new Date(
                                                    sub.subscription.created_at
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            {sub.subscription?.cancel_day
                                                ? new Date(
                                                    sub.subscription.cancel_day
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>
                                            <button className="btn btn-sm btn-warning me-2">
                                                Note
                                            </button>

                                            {sub.user.is_banned ? (
                                                <button className="btn btn-sm btn-success">
                                                    Unban
                                                </button>
                                            ) : (
                                                <button className="btn btn-sm btn-danger">
                                                    Ban
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminPanel
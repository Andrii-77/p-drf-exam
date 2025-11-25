import React, { useEffect, useState } from "react";
import { supportService } from "../services/supportService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaginationComponent } from "../components/pagination-component/PaginationComponent";

const SupportRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const [query, setQuery] = useSearchParams({ page: "1" });

    const page = +query.get("page") || 1; // ✅ приводимо до числа

    useEffect(() => {
        const loadRequests = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await supportService.getAll({ page });

                // очікувана структура: { total_items, total_pages, prev, next, data: [...] }
                setRequests(res.data.data || []);
                setTotalPages(res.data.total_pages || 1);
            } catch (e) {
                console.error(e);
                setError("Помилка при завантаженні звернень");
            } finally {
                setLoading(false);
            }
        };

        loadRequests();
    }, [page]);

    const markProcessed = async (id) => {
        try {
            await supportService.markProcessed(id);
            setRequests((prev) =>
                prev.map((req) =>
                    req.id === id ? { ...req, processed: true } : req
                )
            );
        } catch (e) {
            alert("Помилка при оновленні статусу");
        }
    };

    // ✅ зміна сторінки через setQuery
    const handlePageChange = (newPage) => {
        setQuery({ page: newPage.toString() });
    };

    return (
        <div className="min-h-screen p-6 text-gray-100">
            {/* ← Назад */}
            <button
                onClick={() => navigate(-1)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-lg text-white shadow transition"
            >
                ← Назад
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center">
                Support Запити
            </h1>

            {loading ? (
                <div className="text-gray-500 text-center">Завантаження...</div>
            ) : error ? (
                <div className="text-red-400 text-center">{error}</div>
            ) : (
                <>
                    <div className="overflow-x-auto mt-6">
                        <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
                            <thead className="bg-gray-800 text-gray-200">
                                <tr>
                                    <th className="p-3 text-left">ID</th>
                                    <th className="p-3 text-left">Тип</th>
                                    <th className="p-3 text-left">Текст</th>
                                    <th className="p-3 text-left">Статус</th>
                                    <th className="p-3 text-left">Дія</th>
                                </tr>
                            </thead>

                            <tbody className="bg-gray-900">
                                {requests.map((req) => (
                                    <tr
                                        key={req.id}
                                        className="border-t border-gray-700 hover:bg-gray-800"
                                    >
                                        <td className="p-3">{req.id}</td>
                                        <td className="p-3">{req.type}</td>
                                        <td className="p-3 text-gray-300">{req.text}</td>

                                        <td className="p-3">
                                            {req.processed ? (
                                                <span className="text-green-400 font-semibold">
                                                    ✔ Виконано
                                                </span>
                                            ) : (
                                                <span className="text-yellow-400 font-semibold">
                                                    ⏳ Очікує
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-3">
                                            {!req.processed && (
                                                <button
                                                    onClick={() => markProcessed(req.id)}
                                                    className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg border border-green-500 text-white shadow transition"
                                                >
                                                    Позначити як виконане
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-400">
                                            Немає звернень
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Пагінація */}
                    <div className="flex justify-center mt-6">
                        <PaginationComponent
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange} // ✅ передаємо callback
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export { SupportRequestsPage };
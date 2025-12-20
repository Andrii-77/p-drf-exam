import React, {useEffect, useState} from "react";
import {supportService} from "../services/supportService";
import {useNavigate, useSearchParams} from "react-router-dom";
import {PaginationComponent} from "../components/pagination-component/PaginationComponent";

const SupportRequestsPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useSearchParams({page: "1"});

    const [requests, setRequests] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Фільтри
    const [processed, setProcessed] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [textFilter, setTextFilter] = useState("");

    const [brands, setBrands] = useState([]);

    // Завантаження брендів
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await supportService.getBrands();
                setBrands(res.data || []);
            } catch (e) {
                console.error("Помилка при завантаженні брендів", e);
            }
        };
        if (typeFilter === "model") fetchBrands();
    }, [typeFilter]);

    // Завантаження запитів
    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = {};
                const page = query.get("page") || "1";
                params.page = page;

                if (processed) params.processed = processed;
                if (typeFilter) params.type = typeFilter;
                if (typeFilter === "model" && brandFilter) params.brand = brandFilter;
                if (textFilter) params.text = textFilter.toLowerCase();

                const res = await supportService.getAll(params);

                setRequests(res.data.data || []);
                setTotalPages(res.data.total_pages || 1);
            } catch (e) {
                setError("Помилка при завантаженні звернень");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [query, processed, typeFilter, brandFilter, textFilter]);

    // Зміна сторінки
    const changePage = (newPage) => {
        setQuery({page: String(newPage)});
    };

    // Фільтри
    const changeProcessed = (value) => {
        setProcessed(value);
        setQuery({page: "1"});
    };

    const changeType = (value) => {
        setTypeFilter(value);
        setBrandFilter("");
        setTextFilter("");
        setQuery({page: "1"});
    };

    const changeBrand = (value) => {
        setBrandFilter(value);
        setQuery({page: "1"});
    };

    const changeText = (value) => {
        setTextFilter(value);
        setQuery({page: "1"});
    };

    const resetFilters = () => {
        setProcessed("");
        setTypeFilter("");
        setBrandFilter("");
        setTextFilter("");
        setQuery({page: "1"});
    };

    // Зміна статусу
    const markProcessed = async (id) => {
        try {
            await supportService.markProcessed(id);
            setRequests(prev =>
                prev.map(req => req.id === id ? {...req, processed: true} : req)
            );
        } catch {
            alert("Помилка при оновленні статусу");
        }
    };

    const markUnprocessed = async (id) => {
        try {
            await supportService.markUnprocessed(id);
            setRequests(prev =>
                prev.map(req => req.id === id ? {...req, processed: false} : req)
            );
        } catch {
            alert("Помилка при поверненні статусу");
        }
    };

    return (
        <div className="min-h-screen p-6 text-gray-100">
            <button
                onClick={() => navigate("/moderation")}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-lg text-white shadow transition"
            >
                ← Назад
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center">Запити</h1>

            {/* Фільтри */}
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-6">

                {/* статус */}
                <div className="flex flex-col">
                    <label className="text-gray-300 font-semibold mb-1">Статус</label>
                    <select
                        value={processed}
                        onChange={(e) => changeProcessed(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg"
                    >
                        <option value="">Усі</option>
                        <option value="true">Виконані</option>
                        <option value="false">Очікують</option>
                    </select>
                </div>

                {/* тип */}
                <div className="flex flex-col">
                    <label className="text-gray-300 font-semibold mb-1">Тип</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => changeType(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg"
                    >
                        <option value="">Усі</option>
                        <option value="brand">Бренд</option>
                        <option value="model">Модель</option>
                    </select>
                </div>

                {/* brand */}
                {typeFilter === "model" && (
                    <div className="flex flex-col">
                        <label className="text-gray-300 font-semibold mb-1">Brand</label>
                        <select
                            value={brandFilter}
                            onChange={(e) => changeBrand(e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg"
                        >
                            <option value="">Усі бренди</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.brand}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* текст */}
                <div className="flex flex-col">
                    <label className="text-gray-300 font-semibold mb-1">Текст</label>
                    <input
                        type="text"
                        value={textFilter}
                        onChange={(e) => changeText(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg"
                        placeholder="Пошук по тексту..."
                    />
                </div>

                {/* кнопка скидання фільтрів */}
                <div className="flex items-end">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-red-700 hover:bg-red-600 border border-red-500 rounded-lg text-white shadow transition"
                    >
                        Скинути фільтри
                    </button>
                </div>
            </div>

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
                                <th className="p-3 text-left">Brand</th>
                                <th className="p-3 text-left">Текст</th>
                                <th className="p-3 text-left">Статус</th>
                                <th className="p-3 text-left">Дія</th>
                            </tr>
                            </thead>

                            <tbody className="bg-gray-900">
                            {requests.map((req) => (
                                <tr key={req.id} className="border-t border-gray-700 hover:bg-gray-800">
                                    <td className="p-3">{req.id}</td>
                                    <td className="p-3">{req.type}</td>
                                    <td className="p-3">{req.type === "model" ? req.brand_name || "" : ""}</td>
                                    <td className="p-3 text-gray-300">{req.text}</td>

                                    <td className="p-3">
                                        {req.processed ? (
                                            <span className="text-green-400 font-semibold">✔ Виконано</span>
                                        ) : (
                                            <span className="text-yellow-400 font-semibold">⏳ Очікує</span>
                                        )}
                                    </td>

                                    <td className="p-3">
                                        {req.processed ? (
                                            <button
                                                onClick={() => markUnprocessed(req.id)}
                                                className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 rounded-lg border border-yellow-500 text-white shadow transition"
                                            >
                                                Позначити як не виконане
                                            </button>
                                        ) : (
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
                                    <td colSpan={6} className="p-4 text-center text-gray-400">
                                        Немає звернень
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-6">
                        <PaginationComponent
                            currentPage={+query.get("page") || 1}
                            totalPages={totalPages}
                            onPageChange={changePage}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export {SupportRequestsPage};
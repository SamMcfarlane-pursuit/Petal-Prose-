import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { useToast } from './Toast';

interface CheckoutPageProps {
    cart: CartItem[];
    onOrderComplete: () => void;
    onBack: () => void;
}

type DeliveryOption = 'standard' | 'express' | 'pickup';

interface OrderForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    deliveryOption: DeliveryOption;
    deliveryDate: string;
    deliveryTime: string;
    giftMessage: string;
    isGift: boolean;
    saveInfo: boolean;
}

const TIME_SLOTS = [
    { id: 'morning', label: 'Morning', range: '9:00 AM - 12:00 PM' },
    { id: 'afternoon', label: 'Afternoon', range: '12:00 PM - 4:00 PM' },
    { id: 'evening', label: 'Evening', range: '4:00 PM - 8:00 PM' }
];

const DELIVERY_OPTIONS = [
    { id: 'standard', name: 'Standard Delivery', price: 0, description: '3-5 business days', icon: 'fa-truck' },
    { id: 'express', name: 'Express Delivery', price: 15, description: 'Next business day', icon: 'fa-bolt' },
    { id: 'pickup', name: 'Store Pickup', price: 0, description: 'Ready in 2 hours', icon: 'fa-store' }
];

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onOrderComplete, onBack }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');

    const [form, setForm] = useState<OrderForm>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        deliveryOption: 'standard',
        deliveryDate: '',
        deliveryTime: 'afternoon',
        giftMessage: '',
        isGift: false,
        saveInfo: false
    });

    const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = DELIVERY_OPTIONS.find(d => d.id === form.deliveryOption)?.price || 0;
    const total = subtotal + deliveryFee;

    const updateForm = (field: keyof OrderForm, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof OrderForm, string>> = {};

        if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
        if (!form.phone.trim()) newErrors.phone = 'Phone is required';

        if (form.deliveryOption !== 'pickup') {
            if (!form.address.trim()) newErrors.address = 'Address is required';
            if (!form.city.trim()) newErrors.city = 'City is required';
            if (!form.state.trim()) newErrors.state = 'State is required';
            if (!form.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        setIsProcessing(true);

        // Simulate order processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newOrderId = `PP-${Date.now().toString(36).toUpperCase()}`;
        setOrderId(newOrderId);
        setOrderComplete(true);
        setIsProcessing(false);
        showToast('Order placed successfully!', 'success');
    };

    if (orderComplete) {
        return (
            <div className="pt-32 pb-24 px-8 md:px-12 max-w-3xl mx-auto animate-fade-in">
                <div className="text-center space-y-8">
                    {/* Success Icon */}
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                        <i className="fa-solid fa-check text-5xl text-white"></i>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold serif italic text-stone-900 tracking-tighter">
                            Order Confirmed<span className="text-pink-400">!</span>
                        </h1>
                        <p className="text-xl text-stone-400 font-light">
                            Thank you for your order. Your botanical selection is being prepared with care.
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white rounded-[2rem] border border-stone-100 p-10 space-y-6 text-left shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Order Number</span>
                                <p className="text-2xl font-bold text-stone-900 font-mono">{orderId}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total</span>
                                <p className="text-2xl font-bold text-pink-500 serif italic">${total.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="border-t border-stone-50 pt-6 space-y-4">
                            <div className="flex items-center gap-4 text-stone-600">
                                <i className="fa-solid fa-envelope text-pink-400"></i>
                                <span>Confirmation sent to <strong>{form.email}</strong></span>
                            </div>
                            <div className="flex items-center gap-4 text-stone-600">
                                <i className={`fa-solid ${DELIVERY_OPTIONS.find(d => d.id === form.deliveryOption)?.icon} text-pink-400`}></i>
                                <span>{DELIVERY_OPTIONS.find(d => d.id === form.deliveryOption)?.name} - {DELIVERY_OPTIONS.find(d => d.id === form.deliveryOption)?.description}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button
                            onClick={() => {
                                onOrderComplete();
                                navigate('/');
                            }}
                            className="px-10 py-5 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-pink-600 transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            <i className="fa-solid fa-home"></i>
                            Return Home
                        </button>
                        <Link
                            to="/catalog"
                            onClick={onOrderComplete}
                            className="px-10 py-5 bg-white text-stone-900 border border-stone-200 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all flex items-center justify-center gap-3"
                        >
                            <i className="fa-solid fa-leaf"></i>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-8 md:px-12 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <header className="mb-12 space-y-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors text-sm font-medium"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back to Cart
                </button>
                <h1 className="text-5xl md:text-7xl font-bold serif italic text-stone-900 tracking-tighter">
                    Checkout<span className="text-pink-300">.</span>
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Contact Information */}
                    <section className="bg-white rounded-[2rem] border border-stone-100 p-8 space-y-6 shadow-sm">
                        <h2 className="text-xl font-bold serif italic text-stone-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white text-sm">1</div>
                            Contact Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">First Name *</label>
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={(e) => updateForm('firstName', e.target.value)}
                                    className={`w-full px-6 py-4 bg-stone-50 rounded-xl border ${errors.firstName ? 'border-red-400' : 'border-transparent'} focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900`}
                                    placeholder="John"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Last Name *</label>
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={(e) => updateForm('lastName', e.target.value)}
                                    className={`w-full px-6 py-4 bg-stone-50 rounded-xl border ${errors.lastName ? 'border-red-400' : 'border-transparent'} focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900`}
                                    placeholder="Doe"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Email *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => updateForm('email', e.target.value)}
                                    className={`w-full px-6 py-4 bg-stone-50 rounded-xl border ${errors.email ? 'border-red-400' : 'border-transparent'} focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Phone *</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => updateForm('phone', e.target.value)}
                                    className={`w-full px-6 py-4 bg-stone-50 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-transparent'} focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900`}
                                    placeholder="(555) 123-4567"
                                />
                                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Delivery Options */}
                    <section className="bg-white rounded-[2rem] border border-stone-100 p-8 space-y-6 shadow-sm">
                        <h2 className="text-xl font-bold serif italic text-stone-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white text-sm">2</div>
                            Delivery Method
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {DELIVERY_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => updateForm('deliveryOption', option.id)}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left ${form.deliveryOption === option.id
                                        ? 'border-pink-500 bg-pink-50'
                                        : 'border-stone-100 bg-stone-50 hover:border-stone-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.deliveryOption === option.id ? 'bg-pink-500 text-white' : 'bg-stone-200 text-stone-500'
                                            }`}>
                                            <i className={`fa-solid ${option.icon}`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-stone-900">{option.name}</p>
                                            <p className="text-xs text-stone-400">{option.description}</p>
                                            <p className="text-sm font-bold text-pink-500 mt-2">
                                                {option.price === 0 ? 'Free' : `+$${option.price.toFixed(2)}`}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Delivery Date/Time Selection */}
                    {form.deliveryOption !== 'pickup' && (
                        <section className="bg-white rounded-[2rem] border border-stone-100 p-8 space-y-6 shadow-sm animate-fade-in">
                            <h2 className="text-xl font-bold serif italic text-stone-900 flex items-center gap-3">
                                <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white text-sm">3</div>
                                Preferred Delivery Date
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Delivery Date</label>
                                    <input
                                        type="date"
                                        value={form.deliveryDate}
                                        onChange={(e) => updateForm('deliveryDate', e.target.value)}
                                        min={new Date(Date.now() + (form.deliveryOption === 'express' ? 86400000 : 3 * 86400000)).toISOString().split('T')[0]}
                                        className="w-full px-6 py-4 bg-stone-50 rounded-xl border border-transparent focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900"
                                    />
                                    <p className="text-xs text-stone-400">
                                        {form.deliveryOption === 'express'
                                            ? 'Express: Available as soon as tomorrow'
                                            : 'Standard: 3-5 business days from today'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Time Window</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {TIME_SLOTS.map((slot) => (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => updateForm('deliveryTime', slot.id)}
                                                className={`p-3 rounded-xl border-2 transition-all text-center ${form.deliveryTime === slot.id
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-stone-100 bg-stone-50 hover:border-stone-200'
                                                    }`}
                                            >
                                                <p className="font-bold text-stone-900 text-xs">{slot.label}</p>
                                                <p className="text-[10px] text-stone-400 mt-1">{slot.range}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Shipping Address */}
                    {form.deliveryOption !== 'pickup' && (
                        <section className="bg-white rounded-[2rem] border border-stone-100 p-8 space-y-6 shadow-sm animate-fade-in">
                            <h2 className="text-xl font-bold serif italic text-stone-900 flex items-center gap-3">
                                <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white text-sm">4</div>
                                Shipping Address
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Street Address *</label>
                                    <input
                                        type="text"
                                        value={form.address}
                                        onChange={(e) => updateForm('address', e.target.value)}
                                        className={`w-full px-6 py-4 bg-stone-50 rounded-xl border ${errors.address ? 'border-red-400' : 'border-transparent'} focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900`}
                                        placeholder="123 Flower Lane, Apt 4B"
                                    />
                                    {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">City *</label>
                                        <input
                                            type="text"
                                            value={form.city}
                                            onChange={(e) => updateForm('city', e.target.value)}
                                            className={`w-full px-6 py-4 bg-stone-50 rounded-xl border ${errors.city ? 'border-red-400' : 'border-transparent'} focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900`}
                                            placeholder="New York"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">State *</label>
                                        <input
                                            type="text"
                                            value={form.state}
                                            onChange={(e) => updateForm('state', e.target.value)}
                                            className={`w-full px-6 py-4 bg-stone-50 rounded-xl border ${errors.state ? 'border-red-400' : 'border-transparent'} focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900`}
                                            placeholder="NY"
                                        />
                                        {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">ZIP Code *</label>
                                        <input
                                            type="text"
                                            value={form.zipCode}
                                            onChange={(e) => updateForm('zipCode', e.target.value)}
                                            className={`w-full px-6 py-4 bg-stone-50 rounded-xl border ${errors.zipCode ? 'border-red-400' : 'border-transparent'} focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900`}
                                            placeholder="10001"
                                        />
                                        {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode}</p>}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Gift Options */}
                    <section className="bg-white rounded-[2rem] border border-stone-100 p-8 space-y-6 shadow-sm">
                        <h2 className="text-xl font-bold serif italic text-stone-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500 text-sm">
                                <i className="fa-solid fa-gift"></i>
                            </div>
                            Gift Options
                        </h2>

                        <label className="flex items-center gap-4 cursor-pointer group">
                            <div
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.isGift ? 'bg-pink-500 border-pink-500' : 'border-stone-200 group-hover:border-stone-400'
                                    }`}
                                onClick={() => updateForm('isGift', !form.isGift)}
                            >
                                {form.isGift && <i className="fa-solid fa-check text-white text-xs"></i>}
                            </div>
                            <span className="text-stone-700 font-medium">This order is a gift</span>
                        </label>

                        {form.isGift && (
                            <div className="space-y-2 animate-fade-in">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Gift Message (Optional)</label>
                                <textarea
                                    value={form.giftMessage}
                                    onChange={(e) => updateForm('giftMessage', e.target.value)}
                                    className="w-full px-6 py-4 bg-stone-50 rounded-xl border border-transparent focus:border-pink-400 focus:ring-0 outline-none transition-all text-stone-900 h-32 resize-none"
                                    placeholder="Write a heartfelt message for the recipient..."
                                />
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 bg-white rounded-[2rem] border border-stone-100 p-8 space-y-8 shadow-sm">
                        <h2 className="text-xl font-bold serif italic text-stone-900">Order Summary</h2>

                        {/* Cart Items */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-stone-900 text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-stone-900 text-sm">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-stone-100 pt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-400">Subtotal</span>
                                <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-400">Delivery</span>
                                <span className={`font-medium ${deliveryFee === 0 ? 'text-green-500' : 'text-stone-900'}`}>
                                    {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-stone-100">
                                <span className="text-lg font-bold serif italic text-stone-900">Total</span>
                                <span className="text-2xl font-bold serif italic text-pink-500">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isProcessing || cart.length === 0}
                            className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold text-sm hover:bg-pink-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isProcessing ? (
                                <>
                                    <i className="fa-solid fa-spinner animate-spin"></i>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Complete Order
                                    <i className="fa-solid fa-arrow-right"></i>
                                </>
                            )}
                        </button>

                        {/* Security Note */}
                        <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                            <i className="fa-solid fa-lock"></i>
                            <span>Secure checkout powered by Petal & Prose</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;

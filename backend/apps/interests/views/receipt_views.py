# from Cython.Shadow import float
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.utils import timezone
from weasyprint import HTML
from interests.models import Interest

def generate_receipt_pdf(request, pk):
    # 1. Fetch the object
    interest = get_object_or_404(Interest, pk=pk)
    
    # 2. Extract Related Data (Assumed Structure based on your Interest model)
    # We assume interest.room has a .price and potentially a .property relation
    room = interest.room
    
    # robustly handle related fields if they might be missing
    property_name = getattr(room.listing, 'title', "Student Housing") # Adjust 'property_name' to your actual Room model field
    campus_name = getattr(room.campus, 'name', "Harare Campus") if hasattr(room, 'campus') else "Harare"
    neighborhood_name = getattr(room.listing.neighborhood, 'name', "Downtown") if hasattr(room.listing.neighborhood, 'name') else "Downtown"
    room_price = getattr(room, 'rent_per_month', 0.00) # Adjust 'price' to your actual Room model field
    city_name = getattr(room.listing.neighborhood.city, 'name', "Harare") if hasattr(room.listing.neighborhood, 'city') else "Harare"
    
    # 3. Prepare Data Dictionary
    receipt_data = {
        "receipt_number": f"RCP-{timezone.now().year}-{interest.id:04d}",
        "date_issued": timezone.now().strftime("%Y-%m-%d"),
        "property": {
            "name": property_name, 
            "highlight": f"@ {campus_name}",
            "location": f"{neighborhood_name} • {city_name}"
        },
        "student": {
            "full_name": interest.full_name,
            "id": interest.student_id,
            "program": interest.program,
            "year": interest.year_of_study,
            "contact": interest.phone_number
        },
        "line_items": [
            {
                "desc": f"{property_name} (First Month)",
                "type": "Monthly Rate",
                "type_color": "purple",
                "amount": float(room_price)
            },
            {
                "desc": "Reservation / Agent Fee",
                "type": "One-time Fee",
                "type_color": "gray",
                "amount": float(room.agent_fee)
            }
        ]
    }

    # Calculate Total
    total_amount = sum(item['amount'] for item in receipt_data['line_items'])

    # 4. Define HTML Template (The Modern Design)
    html_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @page {{ size: A4; margin: 1.5cm; }}
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            
            body {{ font-family: 'Inter', Helvetica, sans-serif; color: #1f2937; line-height: 1.5; font-size: 14px; }}
            
            /* Utilities */
            .text-purple {{ color: #6366f1; }}
            .text-gray {{ color: #9ca3af; }}
            .uppercase {{ text-transform: uppercase; }}
            .small-label {{ font-size: 10px; color: #9ca3af; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 4px; display: block; }}
            
            /* Header */
            .header {{ display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; }}
            .brand-section {{ display: flex; gap: 15px; align-items: center; }}
            .brand-icon {{ width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }}
            .brand-title h1 {{ margin: 0; font-size: 22px; color: #111827; }}
            .brand-title p {{ margin: 4px 0 0; font-size: 13px; color: #6b7280; }}
            
            .receipt-meta {{ text-align: right; }}
            .receipt-badge {{ color: #6366f1; font-weight: bold; font-size: 11px; letter-spacing: 1px; margin-bottom: 5px; display: block; }}
            .receipt-number {{ font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 5px; }}
            .receipt-date {{ color: #6b7280; font-size: 13px; display: flex; align-items: center; justify-content: flex-end; gap: 6px; }}

            /* Sections */
            .section-title {{ border-left: 4px solid #6366f1; padding-left: 12px; margin: 40px 0 20px 0; color: #9ca3af; font-weight: 700; font-size: 12px; letter-spacing: 1.2px; }}

            /* Profile Card */
            .profile-card {{ background-color: #f9fafb; border-radius: 16px; padding: 25px 30px; display: table; width: 100%; box-sizing: border-box; }}
            .profile-row {{ display: table-row; }}
            .profile-col {{ display: table-cell; width: 33%; padding-bottom: 20px; vertical-align: top; }}
            .profile-col.last {{ padding-bottom: 0; }}
            .value-large {{ font-size: 15px; font-weight: 700; color: #111827; }}
            .value-with-icon {{ display: flex; align-items: center; gap: 6px; }}

            /* Financial Table */
            .financial-container {{ border: 1px solid #f3f4f6; border-radius: 16px; overflow: hidden; margin-top: 10px; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th {{ text-align: left; color: #9ca3af; font-size: 11px; font-weight: 700; padding: 15px 25px; border-bottom: 1px solid #f3f4f6; }}
            td {{ padding: 20px 25px; vertical-align: middle; }}
            .item-name {{ font-weight: 600; color: #374151; font-size: 15px; }}
            
            /* --- IMPROVED BADGE DESIGN --- */
            .badge {{ 
                padding: 6px 12px; 
                border-radius: 20px; 
                font-size: 11px; 
                font-weight: 600; 
                display: flex; /* Ensures content centers perfectly */
                justify-content: center;
                align-items: center;
                width: fit-content; /* Prevents it from stretching to full width */
            }}
            .badge-purple {{ background-color: #e0e7ff; color: #4338ca; }}
            .badge-gray {{ background-color: #f3f4f6; color: #4b5563; }}

            .total-row td {{ background-color: #0f172a; color: white; padding: 25px; }}
            .total-amount {{ font-size: 24px; font-weight: 700; text-align: right; }}
        </style>
    </head>
    <body>

        <div class="header">
            <div class="brand-section">
                <div class="brand-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="9" y1="18" x2="9" y2="18.01"></line><line x1="15" y1="18" x2="15" y2="18.01"></line><line x1="9" y1="14" x2="9" y2="14.01"></line><line x1="15" y1="14" x2="15" y2="14.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line></svg>
                </div>
                <div class="brand-title">
                    <h1>{receipt_data['property']['name']} <span class="text-purple">{receipt_data['property']['highlight']}</span></h1>
                    <p>📍 {receipt_data['property']['location']}</p>
                </div>
            </div>
            <div class="receipt-meta">
                <span class="receipt-badge uppercase">Payment Receipt</span>
                <div class="receipt-number">{receipt_data['receipt_number']}</div>
                <div class="receipt-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Issued on {receipt_data['date_issued']}
                </div>
            </div>
        </div>

        <div class="section-title uppercase">Student Profile</div>
        <div class="profile-card">
            <div class="profile-row">
                <div class="profile-col">
                    <span class="small-label uppercase">Full Name</span>
                    <div class="value-large">{receipt_data['student']['full_name']}</div>
                </div>
                <div class="profile-col">
                    <span class="small-label uppercase">Student ID</span>
                    <div class="value-large">{receipt_data['student']['id']}</div>
                </div>
                <div class="profile-col">
                    <span class="small-label uppercase">Academic Program</span>
                    <div class="value-large value-with-icon">
                        <span class="text-purple"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg></span>
                        {receipt_data['student']['program']}
                    </div>
                     <span style="font-size: 12px; font-weight: normal; color: #6b7280; display:block; margin-top:4px;">({receipt_data['student']['year']})</span>
                </div>
            </div>
             <div class="profile-row">
                <div class="profile-col last">
                    <span class="small-label uppercase">Contact</span>
                    <div class="value-large value-with-icon">
                         <span style="color: #10b981;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span>
                        {receipt_data['student']['contact']}
                    </div>
                </div>
             </div>
        </div>

        <div class="section-title uppercase">Financial Summary</div>
        <div class="financial-container">
            <table>
                <thead>
                    <tr>
                        <th width="50%">ITEM DESCRIPTION</th>
                        <th width="25%">UNIT TYPE</th>
                        <th width="25%" style="text-align: right;">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    {''.join([f'''
                    <tr>
                        <td class="item-name">{item['desc']}</td>
                        <td>
                             <div class="badge badge-{item['type_color']}">
                                {item['type']}
                             </div>
                        </td>
                        <td style="text-align: right; font-weight: bold;">${item['amount']:.2f}</td>
                    </tr>
                    ''' for item in receipt_data['line_items']])}
                    <tr class="total-row">
                        <td colspan="2" class="total-label">Total Due Now</td>
                        <td class="total-amount">${total_amount:.2f}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </body>
    </html>
    """
    
    # 5. Generate and Return PDF
    pdf_file = HTML(string=html_template).write_pdf()
    
    response = HttpResponse(pdf_file, content_type='application/pdf')
    filename = f"Receipt_{interest.student_id}.pdf"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response
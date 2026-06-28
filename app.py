import os
import json
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Ensure data directory exists for RFQ submissions, using /tmp on Vercel
if os.environ.get('VERCEL'):
    DATA_FILE = '/tmp/rfq_submissions.json'
else:
    DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rfq_submissions.json')

@app.route('/')
def home():
    """Render the main export catalog and RFQ page."""
    return render_template('index.html')

@app.route('/submit-rfq', methods=['POST'])
def submit_rfq():
    """
    Handle the submission of a Request For Quote (RFQ) from B2B buyers.
    Validates fields and stores them in a local JSON file.
    """
    try:
        # Get JSON data or Form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()

        # Extract fields
        company_name = data.get('company_name', '').strip()
        contact_name = data.get('contact_name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        destination_port = data.get('destination_port', '').strip()
        product_type = data.get('product_type', '').strip()
        processing_format = data.get('processing_format', '').strip()
        size_grading = data.get('size_grading', '').strip()
        freezing_format = data.get('freezing_format', '').strip()
        glazing = data.get('glazing', '').strip()
        notes = data.get('notes', '').strip()

        # Validation
        errors = {}
        if not company_name:
            errors['company_name'] = 'Company name is required.'
        if not contact_name:
            errors['contact_name'] = 'Contact person name is required.'
        if not email:
            errors['email'] = 'Email address is required.'
        elif '@' not in email:
            errors['email'] = 'Please enter a valid email address.'
        if not destination_port:
            errors['destination_port'] = 'Target destination port is required.'
        if not product_type:
            errors['product_type'] = 'Please select a product variety.'
        if not processing_format:
            errors['processing_format'] = 'Please select a processing format.'
        if not size_grading:
            errors['size_grading'] = 'Please select a size grading count range.'

        if errors:
            return jsonify({
                'success': False,
                'errors': errors,
                'message': 'Please fix the errors in the form.'
            }), 400

        # Create RFQ record
        rfq_record = {
            'id': datetime.now().strftime('%Y%m%d%H%M%S%f'),
            'timestamp': datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            'company_name': company_name,
            'contact_name': contact_name,
            'email': email,
            'phone': phone,
            'destination_port': destination_port,
            'product_type': product_type,
            'processing_format': processing_format,
            'size_grading': size_grading,
            'freezing_format': freezing_format,
            'glazing': glazing,
            'notes': notes,
            'status': 'Pending Review'
        }

        # Read existing RFQs
        rfqs = []
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        rfqs = json.loads(content)
            except Exception as e:
                app.logger.error(f"Error reading JSON: {e}")

        # Fallback read from /tmp if not already using /tmp but primary read yielded nothing
        if not rfqs and DATA_FILE != '/tmp/rfq_submissions.json':
            alt_data_file = '/tmp/rfq_submissions.json'
            if os.path.exists(alt_data_file):
                try:
                    with open(alt_data_file, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        if content:
                            rfqs = json.loads(content)
                except Exception as alt_e:
                    app.logger.error(f"Error reading from fallback /tmp JSON: {alt_e}")

        # Append new record
        rfqs.append(rfq_record)

        # Write back to JSON
        try:
            dir_name = os.path.dirname(DATA_FILE)
            if dir_name:
                os.makedirs(dir_name, exist_ok=True)
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(rfqs, f, indent=4, ensure_ascii=False)
        except Exception as e:
            app.logger.error(f"Failed to write to primary DATA_FILE: {e}")
            # If primary write failed and we weren't already writing to /tmp, try /tmp as a fallback
            if DATA_FILE != '/tmp/rfq_submissions.json':
                try:
                    alt_data_file = '/tmp/rfq_submissions.json'
                    alt_dir = os.path.dirname(alt_data_file)
                    if alt_dir:
                        os.makedirs(alt_dir, exist_ok=True)
                    with open(alt_data_file, 'w', encoding='utf-8') as f:
                        json.dump(rfqs, f, indent=4, ensure_ascii=False)
                    app.logger.info("Successfully wrote to fallback /tmp/rfq_submissions.json")
                except Exception as alt_e:
                    app.logger.error(f"Failed to write to fallback /tmp JSON file: {alt_e}")

        return jsonify({
            'success': True,
            'message': 'RFQ successfully submitted! Our trade managers will contact you within 24 hours.',
            'rfq_id': rfq_record['id']
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Bind to host 0.0.0.0 and port 5000 for local testing
    app.run(host='0.0.0.0', port=5000, debug=True)

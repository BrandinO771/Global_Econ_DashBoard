import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/econ_db.sqlite"
db = SQLAlchemy(app)
Base = automap_base()
Base.prepare(db.engine, reflect=True)
econ_1_ = Base.classes.econ


####################################################
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


####################################################
@app.route("/names")
def names():
    """Return a list of COUNTRY names."""
    stmt = db.session.query(econ_1_).statement
    # print("stmt is", stmt, type(stmt))
    df = pd.read_sql_query(stmt, db.session.bind)
    # print("df", df, type(stmt))
    return jsonify(list(df["country_name_a"]))

    
####################################################


###################################################################################
#      BELOW PRINT RETURN OF ALL DATA FOR COUNTRY USER HOVERS OVER WITH MOUSE     #
###################################################################################
@app.route("/metadata/<sample>")
def sample_metadata(sample):

    sel = [
            econ_1_.country_name_a,
            econ_1_.World_Rank,
            econ_1_.Region_Rank,
            econ_1_._2019_Score,
            econ_1_.Property_Rights,
            econ_1_.Judical_Effectiveness,
            econ_1_.Government_Integrity,
            econ_1_.Tax_Burden,
            econ_1_.Govt_Spending,
            econ_1_.Fiscal_Health,
            econ_1_.Business_Freedom,
            econ_1_.Labor_Freedom,
            econ_1_.Monetary_Freedom,
            econ_1_.Trade_Freedom,
            econ_1_.Investment_Freedom,
            econ_1_.Financial_Freedom,
            econ_1_.Tariff_Rate,
            econ_1_.Income_Tax_Rate,
            econ_1_.Corporate_Tax_Rate,
            econ_1_.Tax_Burden__of_GDP,
            econ_1_.Govt_Expenditure_of_GDP,
            econ_1_.Population_Millions,
            econ_1_.GDP_Billions_PPP,
            econ_1_.GDP_Growth_Rate,
            econ_1_._5_Year_GDP_Growth_Rate,
            econ_1_.GDP_per_Capita_PPP,
            econ_1_.Unemployment,
            econ_1_.Inflation,
            econ_1_.FDI_Inflow_Millions,
            econ_1_.Public_Debtof_GDP
         ]

    results = db.session.query(*sel).filter(econ_1_.country_name_a == sample).all()
    sample_metadata = {}

    for result in results:
        sample_metadata["A. Country"]       = result[0]      
        sample_metadata["B. World Rank"]    = result[1]
        sample_metadata["C. 2019 Score"]    = result[3]
        sample_metadata["L. Judical Efficieny"] = result[5]
        sample_metadata["K. Govt Integrity"]    = result[6]
        sample_metadata["Q. Tax Burden"]    = result[7]
        sample_metadata["I. Govt Spending"] = result[8]
        sample_metadata["E. Fiscal Health"] = result[9]
        sample_metadata["M. Business Freedom"]  = result[10]
        sample_metadata["P. Tariff Rate"]   = result[16]
        sample_metadata["R. Income Tax Rate"]   = result[17]
        sample_metadata["S. Corporate Tax Rate"]    = result[18]
        sample_metadata["D. Population Millions"]   = result[21]
        sample_metadata["J. GDP Growth Rate"]   = result[23]
        sample_metadata["F. Unemployment"]  = result[26]
        sample_metadata["G. Inflation"]     = result[27]
        sample_metadata["H. Public Debt of GDP"]    = result[29]
    # print("here is the sample meta data", sample_metadata)
    return jsonify(sample_metadata)
###################################################################################



###################################################################################
#      BELOW RETURN TOP TEN BY USER ECON CATEGORY SELECTION                       #
###################################################################################
@app.route("/top_ten/<user_selection>")
def top_ten_five(user_selection):
    sort_method = 0 
    method_list = [ 'World_Rank', 'Inflation','Public_Debtof_GDP', 'Income_Tax_Rate', 'Corporate_Tax_Rate','Unemployment']
    if user_selection in method_list :
        sort_method = 1  
    else :
        sort_method = 2 

    if ( user_selection == 'World_Rank'):
            query_var =  econ_1_.World_Rank # SORT ASC
    if ( user_selection == 'Inflation'):# SORT ASC
            query_var =  econ_1_.Inflation  # SORT ASC
    if ( user_selection == 'Public_Debtof_GDP'): # SORT ASC
            query_var =  econ_1_.Public_Debtof_GDP
    if ( user_selection == 'Income_Tax_Rate'):  # SORT ASC
            query_var =  econ_1_.Income_Tax_Rate
    if ( user_selection == 'Corporate_Tax_Rate'):  # SORT ASC
            query_var =  econ_1_.Corporate_Tax_Rate
    if ( user_selection == 'Unemployment'):  # SORT ASC
            query_var =  econ_1_.Unemployment
    if ( user_selection == 'Government_Integrity'):
            query_var =  econ_1_.Government_Integrity
    if ( user_selection == 'Judical_Effectiveness'):
            query_var =  econ_1_.Judical_Effectiveness
    if ( user_selection == 'Fiscal_Health'):
            query_var =  econ_1_.Fiscal_Health
    if ( user_selection == 'GDP_Billions_PPP'):
            query_var =  econ_1_.GDP_Billions_PPP
    if ( user_selection == 'Population_Millions'):
            query_var =  econ_1_.Population_Millions

    sel =   [
            econ_1_.country_name_a,
            query_var
            ]
    # #   TAKE THE SELECTION FROM WEBPAGE QUERY , GRAB THE COUNTRY NAMES AND THE SELECTION VALUES GRAP TOP 10 
    if (sort_method == 2) :
        results = db.session.query(*sel).filter(query_var>0).order_by(sel[1].desc()).limit(10).all()
    if (sort_method == 1) :
        results = db.session.query(*sel).filter(query_var>0).order_by(sel[1]).limit(10).all()

    all_results=[]
    sample_datas = {}

    for result in results: ## BUILD OUR TOP TEN DICTIONARY HERE 
                # print(result)
                sample_datas = { "name" : result[0] , "value" :format(result[1] , ',')  } 
                all_results.append(sample_datas)

    # print("all_results are ", all_results )
    return jsonify(all_results)

##################################################################################################################   
##################################################################################################################   



if __name__ == "__main__":
    app.run()


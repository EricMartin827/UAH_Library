import React from "react";

export function renderField(field) {
    const { meta : { touched, error } } = field;
    const className = `form-group ${(touched && error) ? "has-danger" : ""}`;
    return (
        <div className={className}>
            <label>{field.label}</label>
            <input className="form-control" type={field.type}
                {...field.input} />
            <div className="text-help">
                {touched ? error : ""}
            </div>
        </div>
    );
}

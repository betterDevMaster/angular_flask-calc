import { AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms';

export function UrlValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    if (!control.value.startsWith('https') || !control.value.includes('.me')) {
      return { invalid: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
export function MobileValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    if (!control.value.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) {
      return { invalid: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
export function EmailValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    if (
      !control.value
        .toString()
        .match(/^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,8}$/)
    ) {
      return { invalid: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
export function AlphaValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    if (!control.value.toString().match(/^[-a-zA-Z]+(( ?)+[-a-zA-Z]+)*$/)) {
      return { AlphaValidator: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
export function NumericValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    if (!control.value.toString().match(/^[0-9]+$/)) {
      return { NumericValidator: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
export function AlphaNumericValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    if (
      !control.value.toString().match(/^[-a-zA-Z0-9]+(( ?)+[-a-zA-Z0-9]+)*$/)
    ) {
      return { AlphaNumericValidator: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
export function AllowedCharacterValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    if (
      !control.value
        .toString()
        .match(
          /^[a-zA-Z0-9_&/,.\[\]]+(( ?)+[a-zA-Z0-9_&/,.\[\]]+)*$/
        )
    ) {
      return { AllowedCharacterValidator: true };
    } else {
      return null;
    }
  } else {
    return null;
  }
}
export function PasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    const password = control.value.toString();
    if (password.length < 7) {
      return { PasswordValidator: true, minLength: true };
    }
    else {
      return null;
    }
  } else {
    return null;
  }
}
export function PasswordValidation(password: string): boolean {
  const regex = /[$-/:-?{-~!"^_@`\[\]]/g;
  const lowerLetters = /[a-z]+/.test(password);
  const upperLetters = /[A-Z]+/.test(password);
  const numbers = /[0-9]+/.test(password);
  const symbols = regex.test(password);

  if (
    password.length >= 6 &&
    password.length < 32 &&
    lowerLetters &&
    upperLetters &&
    numbers &&
    symbols
  ) {
    return true;
  } else {
    return false;
  }
}
export function FormErrorMessage(formGroup: FormGroup, control: string): string {
  const controlValue = formGroup.get(control).errors;
  if (controlValue) {
    if (controlValue.required) {
      return 'This field is required';
    }
    else if (controlValue.minlength) {
      return 'Please enter at least ' + controlValue.minlength.requiredLength + ' characters';
    }
    else if (controlValue.maxlength) {
      return 'Please enter not more than  ' + controlValue.maxlength.requiredLength + ' characters';
    }
    else if (controlValue.email) {
      return 'Please enter valid email';
    }
    else if (controlValue.UrlValidator) {
      return 'Please enter valid url';
    }
    else if (controlValue.MobileValidator) {
      return 'Please enter valid mobile number';
    }
    else if (controlValue.AlphaValidator) {
      return 'Please enter only alphabets';
    }
    else if (controlValue.NumericValidator) {
      return 'Please enter only number';
    }
    else if (controlValue.AlphaNumericValidator) {
      return 'Please enter only alphabets and numbers';
    }
    else if (controlValue.AllowedCharacterValidator) {
      return 'Please use only \'a-zA-Z0-9_&,./\' special characters';
    }
    else if (controlValue.PasswordValidator) {
      return 'Password must be at least 7 characters of any type';
    }
    else {
      return controlValue.error;
    }
  }
}

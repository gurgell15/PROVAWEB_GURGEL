function appendToDisplay(value) {
    document.getElementById("display").value += value;
  }
  
  // Função para limpar o display
  function clearDisplay() {
    document.getElementById("display").value = '';
  }
  
  // Função para calcular o resultado usando eval
  function calculateResult() {
    const display = document.getElementById("display");
    try {
      // Usando eval para calcular a expressão
      display.value = eval(display.value);
    } catch (e) {
      display.value = "Erro";
    }
  }
  